const Big = require('big.js')
const assert = require('assert')
const request = require('request')
const cheerio = require('cheerio')
const erroAoObterCotacoes = new Error('Erro ao obter cotações')

const URL = 'https://www.cotacao.com.br/cotacao-das-moedas.html'
const SYMBOLS = {
  'Dólar Americano': 'USD',
  'Euro': 'EUR',
  'Libra Esterlina': 'GBP',
  'Dólar Australiano': 'AUD',
  'Dólar Canadense': 'CAD',
  'Iene': 'JPY',
  'Coroa Dinamarquesa': 'DKK',
  'Coroa Norueguesa': 'NOK',
  'Coroa Sueca': 'SEK',
  'Dólar Nova Zelândia': 'NZD',
  'Franco Suiço': 'CHF',
  'Peso Argentino': 'ARS',
  'Peso Chileno': 'CLP',
  'Peso Mexicano': 'MXN',
  'Peso Uruguaio': 'UYU',
  'Rande': 'ZAR',
  'Shekel Israelense': 'ILS',
  'Yuan': 'CNY',
  'Rublo Russo': 'RUB',
  'Dirham Emirados Arabes': 'AED',
  'Peso Colombiano': 'COP',
}

function removerMascara (valorComMascara) {
  return parseFloat(valorComMascara
            .toString()
            .replace('R$', '')
            .replace('.', '')
            .replace(',', '.')
            .trim()) || null
}

const listar = (iof, cb) => {
  const informouIof = typeof iof === 'number'
  assert(informouIof, 'é necessário informar uma aliquota de IOF')

  const moedas = []
  const cotacoes = {
    base: 'BRL',
    rates: { }
  }

  request(URL, (err, res) => {
    if (err) {
      return cb(err)
    }

    if (res.statusCode !== 200) {
      return cb(erroAoObterCotacoes)
    }

    const html = res.body
    const $ = cheerio.load(html)
    const $trs = $('table').find('tr')

    $trs.each(function (i, tr) {
      const $tr = cheerio.load(tr)
      const $tds = $('td')

      if(!$tds.length) {
        return
      }

      let moeda = cheerio.load($tds.get(0))
      moeda = moeda.text()
      moeda = SYMBOLS[moeda]

      if (!moeda) {
        return
      }

      let valor = cheerio.load($tds.get(1))
      valor = valor.text()
      valor = removerMascara(valor)
      valor = new Big(1).div(valor).times(iof + 1).valueOf()
      valor = parseFloat(valor)

      moedas.push(moeda)
      cotacoes.rates[moeda] = valor
    })

    moedas.push(cotacoes.base)
    cotacoes.rates[cotacoes.base] = 1

    cb(null, cotacoes, moedas)
  })
}

module.exports.listar = listar
