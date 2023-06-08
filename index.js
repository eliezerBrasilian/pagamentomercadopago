const express = require('express');
const MercadoPago = require('mercadopago');
const app = express();
const port = 3000;

MercadoPago.configure({
  sandbox: true,
  access_token:
    'TEST-2409891704417953-073101-3623918d40a0e69c2038163c18beb84d-291653679',
});
app.get('/', (req, res) => res.send('Hello World!'));

let id = String(Date.now());
app.get('/pagar', async (req, res) => {
  /* 
    suponhamos que tenho uma tabela com a seguinte estrutura
    id/codigo_da_venda/pagador/status

    => o codigo da venda seria o id único que foi gerado nessa operação
    => o pagador pode ser o email
    => status se foi pago ou nao

    mas claro que posso colocar mais coisas na minha tabela
    ficando assim:
    1/722822839482/eliezer.@ufv.br/pago

    */
  const dados = {
    items: [
      (item = {
        id: id,
        title: '2 camisas;1 tenis',
        quantity: 1,
        currency_id: 'BRL',
        unit_price: parseFloat(400),
      }),
    ],
    payer: {
      email: 'eliezer.@ufv.br',
    },
    external_reference: id,
  };
  try {
    let pagamento = await MercadoPago.preferences.create(dados);
    console.log(pagamento);
    //redirecionando para a url de checkout
    return res.redirect(pagamento.body.init_point);
  } catch (err) {
    //estamos retornando a mensagem na cara do usuario
    //mas o ideal é tratar isso
    return res.send(err.message);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
