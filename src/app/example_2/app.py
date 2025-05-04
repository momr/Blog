from pathlib import Path
from shiny import App, render, ui, Inputs, Outputs, Session
from utils import square

app_ui = ui.page_fluid(
    ui.layout_columns(
        ui.input_slider("n", "Make a Shiny square:", min=0, max=6, value=2),
        ui.output_ui("images"),
    )
)

def server(input: Inputs, output: Outputs, session: Session):
    @output
    @render.ui
    def images():
        img = ui.img(src="logo.png", style="width: 40px;")
        return square(img, input.n())

www_dir = Path(__file__).parent / "www"
app = App(app_ui, server, static_assets=www_dir)
