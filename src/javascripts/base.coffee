LED_MAPPING = {
  led_right: "#f-led-right",
  led_left: "#f-led-left",
}
LED_STRIP_LENGTH = 50

safeColorFromString = (rgb_array) ->
  return "rba(0, 0, 0)" if typeof rgb_array == 'string'

  length = rgb_array.length
  colors = rgb_array.map (color) ->
    c = parseInt(color, 10) || 0
    if color > 255
      c = 255
    else if color < 0
      c = 0
    return c

  if colors.length == 1
    colors.push(colors[0], colors[0])
  else if colors.length == 2
    colors.push(0)

  "rgb(#{colors.slice(0, 3).join(', ')})"

mapRange = (value, low1, high1, low2, high2) ->
  low2 + (high2 - low2) * (value - low1) / (high1 - low1)

updateLedStripColors = (selector, colors) ->
  return if colors.length == 0

  diodes = $("#{selector} .f-led__diode")

  for color, i in colors
    newPos = Math.floor(mapRange(i, 0, colors.length, 0, LED_STRIP_LENGTH))

    for j in [0...LED_STRIP_LENGTH / colors.length]
      c = safeColorFromString(color)
      $(diodes[newPos + j]).css("color", c)

$ ->
  socket = io()

  socket.on 'action', (params) ->
    return unless params

    console.log 'data', params

    for key, selector of LED_MAPPING
      if params[key]
        updateLedStripColors(selector, params[key])
