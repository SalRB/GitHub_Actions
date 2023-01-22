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
  Cypress_job:
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

#

## Add_badge_job

Este job lo que hace es modificar el README dependiendo de si el test de Cypress del job anterior ha salido bien o mal, añadiendo una insignia acorde al resultado.

Primero carga el artefacto que ha subido el job anterior y lo extrae del archivo, tras ello llama a la action que hemos creado para que cambie el readme y por último llama a la action encargada de hacer push al repositorio, para ello tendremos que añadir el token que permite hacer commit como secreto del repositorio.

```yml
  Add_badge_job:
    runs-on: ubuntu-latest
    needs: Cypress_job
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Upload-Artifact
        uses: actions/download-artifact@v2
        with:
          name: result
      - name: Get file data
        id: data
        run: echo "::set-output name=cypress_outcome::$(cat result.txt)"
      - name: Custom action
        uses: ./.github/actions/badge
        env:
          res: ${{ steps.data.outputs.cypress_outcome }}
      - name: Endbug
        uses: EndBug/add-and-commit@v9
        with:
          add: "."
          author_name: "Salva Roig"
          author_email: "salroiba03@gmail.com"
          message: "Readme Updated succesfully."
          push: true
```


Cuando el test se hace correctamente:

![Imagen](/assets/03.png)

Cuando el test falla:

![Imagen](/assets/04.png)

La action que hemos creado es bastante simple, solo establece que tomará la variable res, la versión de node que utilizará y el archivo js. 

```yml
name: "Add badge"
inputs:
  res:
    required: true
runs: 
  using: node16
  main: dist/index.js
```

El cuál establece cuál será el enlace de la insignia que usaremos y genera un nuevo readme tomando el anterior y cambiando la insignia antigua por la nueva.

```js
const fs = require("fs");
const path = require('path');

const readme = path.resolve('./README.md')

const res = process.env.res;

let URL;

const bad = "https://img.shields.io/badge/test-failure-red"
const good = "https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg"

if (res == "failure") {
    URL = bad;
} else if (res == "success") {
    URL = good;
}

fs.readFile(readme, 'utf8', function (err, data) {
    if (err) throw err;
    let updatedReadme = data.search(good) !== -1 ? data.replace(good, URL) : data.replace(bad, URL)
    fs.writeFile(readme, updatedReadme, function (err) {
        if (err) throw err;
        console.log('Archivo actualizado.');
    })
});
```


#

## Deploy_job

Por último en este repositorio, un job que utlizará la plataforma Vercel para desplegar nuestra aplicación, para ello tendremos que crear una cuenta si no la teníamos, así como un nuevo proyecto a partir de un reposiotrio de Github.

Este job es bastante simple, lo único que hace es llamar a la action de Vercel, pero para que funcione necesitaremos añadir 3 secretos al repositorio, son los siguientes:

    * VERCEL_TOKEN: En el perfil vamos a Settings > Tokens y creamos uno nuevo.
    * ORG_ID: En el perfil, Settings > General, lo veremos bajando un poco.
    * PROJECT_ID: Vamos a la página de Dashboard, elegimos el proyecto actual y vamos a Settings.

```yml
  Deploy_job:
    needs: Cypress_job
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID}}
          vercel-project-id: ${{ secrets.PROJECT_ID}}
```

[Enlace](https://salvarb-actions-6l2tc7iii-salrb.vercel.app/)

#

## Readme personal

Para terminar vamos a utilizar nuestro repositorio personal, aquel que tiene el mismo nombre que nuestra cuenta. En él, vamos a crear un workflow y un readme con un enlace al archivo que creará la action: /github-metrics.svg

Nada nuevo en este job, establecemos los permisos y ponemos el token que hemos utilizado en el job "Add_badge_job" como secreto. 

```yml
name: Readme
on: [push]
jobs:
  github-metrics:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: lowlighter/metrics@latest
        with:
          token: ${{ secrets.METRICS_TOKEN }}
```

[Repositorio](https://github.com/SalRB/SalRB)


RESULTADO TEST CYPRESS:

<!---Start place for the badge -->
[![Cypress.io](https://img.shields.io/badge/test-failure-red)](https://www.cypress.io/)
<!---End place for the badge -->
