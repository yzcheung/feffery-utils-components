import dash
from dash import html
import feffery_utils_components as fuc

app = dash.Dash(__name__, compress=True)

app.layout = html.Div(
    [
        fuc.FefferyWordPreview(
            src='https://501351981.github.io/vue-office/examples/dist/static/test-files/test.docx',
            style={
                'height': 500
            }
        )
    ]
)

if __name__ == '__main__':
    app.run(debug=True)
