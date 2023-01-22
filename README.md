# GITHUB ACTIONS SALVA ROIG

## Linter_job

Este será el encargado de comprobar que el codigo esté bien escrito y que sigue la metodología del linter utilizado. En nuestro caso, como se puede ver en el segundo commit de este repositorio, hacía falta cambiar los archivos dentro de la carpeta users para que utilziasen comillas dobles en vez de simples y variables de tipo let en vez de var.

Más allá de eso, el job es bastante simple, simplemente hace un verificación del codigo y hace una instalación de eslint para luego usar el comando que lo ejecutará.

```yml
  Linter_job:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
      - name: Linter execution
        run: npm install --save-dev eslint && npx next lint
```

<!---Start place for the badge -->
[![Cypress.io](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)](https://www.cypress.io/)

<!---End place for the badge -->
