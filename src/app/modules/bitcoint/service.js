/**
 * Created by garusis on 06/04/17.
 */
import _ from "lodash"
import module from "./config"

BitfinexFactory.inject = ["$rootScope"]
function BitfinexFactory ($rootScope) {

  return {
    subscribeTicker: function (symbol) {

      const lastData = []

      const wss = new WebSocket('wss://api.bitfinex.com/ws/')
      wss.onmessage = function (msg) {
        let data = JSON.parse(msg.data)
        if (_.isArray(data) && data[1] !== "hb") {
          $rootScope.$apply(function () {
            lastData.push(data)
          })
        }
      }

      wss.onopen = function () {
        wss.send(JSON.stringify({
          event: 'subscribe',
          channel: 'ticker',
          symbol: symbol
        }))
      }

      return lastData

    }
  }

}

module.factory("Bitfinex", BitfinexFactory)
