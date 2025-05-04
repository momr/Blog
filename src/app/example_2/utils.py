from shiny import ui

def square(x, n):
    row = ui.div([x] * n)
    return ui.div([row] * n)
