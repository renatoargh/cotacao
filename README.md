# cotacao

Dados públicos em `https://www.cotacao.com.br/cotacao-das-moedas.html`

Preparado para funcionar com https://www.npmjs.com/package/bigmoney.js

```javascript
const cotacao = require('cotacao')
const IOF = 0.011

cotacao.listar(IOF, (err, cotacoes, moedas) => {
  if (err) {
    throw err
  }

  console.log(moedas)
  console.log(cotacoes)
})
```

### MIT
