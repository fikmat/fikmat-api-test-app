safeColorFromString = (string) ->
  return "rba(0, 0, 0)" if typeof string != 'string'

  colors = string.split(',')
  length = colors.length
  colors = colors.map (color) ->
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

LED_MAPPING = {
  led_top: "#f-led__top",
  led_right: "#f-led__right",
  led_left: "#f-led__left",
}

$ ->
  socket = io()

  socket.on 'action', (params) ->
    return unless params

    console.log 'data', params

    for key, selector of LED_MAPPING
      if params[key]
        color = safeColorFromString(params[key])

        console.log "#{key} -> #{color}"

        $(selector).css("color", color)
