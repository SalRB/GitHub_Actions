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

En esta imagen se ve lo que nos mostrará la action cuando tenemos algún error.

![Imagen](/assets/01.png)

#

## Cypress_job

Este job será el encargado de ejecutar otro test, esta vez utilizando la herramienta cypress, la cuál emulará la aplicación y hará ciertas acciones para comprobar que funcione correctamente. Para para hacer que no diese errores ha hecho falta corregir un error en un archivo en el que ponía POST0 en vez de POST.

Lo primero que hará será hacer un npm install para mas tarde poder iniciar la aplicación, tras ello, en el step de cypress se concretan los comando para hacer build y start a la aplicación, así como el archivo de configuración de cypress(se establece que continue pese a fallar para el siguiente job). Con el resultado del step anterior creamos un txt que a continuación subiremos como un artefacto para que lo pueda utilizar el job que modifica el readme.

```yml
    runs-on: ubuntu-22.04
    needs: Linter_job
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Server install
        run: npm install
      - name: Cypress run
        id: cypress_test
        uses: cypress-io/github-action@v5
        with:
          config-file: cypress.json
          build: npm run build
          start: npm start
        continue-on-error: true
      - name: Create file
        run: echo ${{ steps.cypress_test.outcome }}  > result.txt
      - name: Upload-Artifact
        uses: actions/upload-artifact@v2
        with:
          name: result
          path: result.txt
```

Aquí lo que pasa cuando los tests devuelven errores:

![Imagen](/assets/02.png)




RESULTADO TEST CYPRESS:

<!---Start place for the badge -->
[![Cypress.io](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)](https://www.cypress.io/)

<!---End place for the badge -->
