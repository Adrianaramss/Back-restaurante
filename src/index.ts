import express, {Request,Response} from 'express'
import cors from 'cors'
import {db} from "./database/knex"
const app = express()

app.use(cors())
app.use(express.json())
app.listen(Number(process.env.PORT), () => {
  console.log(`Servidor rodando na porta ${Number(process.env.PORT)}`)
})
// testando com postman 
app.get('/ping', (req: Request, res: Response) => {
    res.send('Pong!')
})


app.get("/usuarios", async (req: Request, res: Response) => {
    try {

        const result = await db.select("*").from("usuarios")
        res.status(200).send(result)
        console.log(result)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.post('/usuarios', async (req: Request, res: Response) => {
  try {
    const { nome, email, senha } = req.body;
    const existingUser = await db('usuarios').where('email', email).first();
    if (existingUser) {
      return res.status(400).send('Este usuário já está cadastrado');
    }
    await db('usuarios').insert({ nome, email, senha });

    res.status(201).send('Usuário cadastrado com sucesso!');
  } catch (error) {
    console.log(error);
    res.status(500).send('Erro ao cadastrar usuário');
  }
});


  app.post('/login', async (req: Request, res: Response) => {
    try {
      const { email, senha } = req.body;
  
      const user = await db('usuarios').where('email', email).first();
      if (!user) {
        return res.status(401).send('Usuário não encontrado');
      }
  
      if (user.senha !== senha) {
        return res.status(401).send('Senha incorreta');
      }
      res.status(200).send({ user_id: user.id, message: "Login bem-sucedido!" });

    } catch (error) {
      console.log(error);
  
      if (res.statusCode === 200) {
        res.status(500);
      }
  
      if (error instanceof Error) {
        res.send(error.message);
      } else {
        res.send('Erro inesperado');
      }
    }
  });
  

  
app.get("/reservas", async (req: Request, res: Response) => {
  try {
      const result = await db.select("*").from("reservas")
      res.status(200).send(result)
      console.log(result)
  } catch (error) {
      console.log(error)

      if (req.statusCode === 200) {
          res.status(500)
      }

      if (error instanceof Error) {
          res.send(error.message)
      } else {
          res.send("Erro inesperado")
      }
  }
})

app.post("/reservas", async (req, res) => {
  try {
    const { usuario_id, mesa_id, data, horario,pessoas } = req.body;

    const reservaHorario = new Date(`${data}T${horario}`);
    const diaSemana = reservaHorario.getDay();

    if (diaSemana === 0) {
      return res.status(400).send("Não é permitido fazer reservas aos domingos.");
    }

    const startTime = new Date(`${data}T18:00:00`);
    const endTime = new Date(`${data}T23:59:59`);

    if (reservaHorario < startTime || reservaHorario > endTime) {
      return res.status(400).send("As reservas são permitidas apenas das 18:00 às 23:59.");
    }

    const existingReserva = await db("reservas")
      .where({ mesa_id, data, horario,pessoas })
      .first();

    if (existingReserva) {
      return res.status(400).send("Já existe uma reserva para o mesmo horário e mesa");
    }
    const user = await db("usuarios")
      .select("nome")
      .where({ id: usuario_id })
      .first();

    if (!user) {
      return res.status(400).send("Usuário não encontrado.");
    }
    const newReserva = await db("reservas").insert({
      usuario_id,
      mesa_id,
      data,
      horario,
      pessoas,
      nome:user.nome
    });

    res.status(201).send(`Reserva criada com sucesso. ID: ${newReserva[0]}`);
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro ao criar reserva");
  }
});

app.get("/reservas/usuario/:idUsuario", async (req: Request, res: Response) => {
  try {
    const idUsuario = req.params.idUsuario;

    const result = await db.select("*").from("reservas").where("usuario_id", idUsuario);

    res.status(200).send(result);
    console.log(result);
  } catch (error) {
    console.log(error);

    if (res.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});