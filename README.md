# CRISPRcleanR WebApp

## **Development environment**

### Project setup

```

npm install

```

### Compiles and hot-reloads for development

```

npm run serve

```

### Run unit tests

```

npm run test:unit

```

### Lint and fix files

```

npm run lint

```

---

## **Production Environment**

The production environment is based on serving the app through a **dockerized nginx server**.

### Pull production image from Gitlab

It is always recommended to pull the docker image from the remote container registry, rather than building the image on the production machine

```

docker-compose -f docker-compose.yml -f docker-compose.prod.yml pull

```

### Run container

```

docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

```

### **Notes on Production**

- The node server (i.e. running the project outside of a container with `npm run serve`) <span style="color:red"> cannot be used in production</span>. The problem is about a lack of configuration of the plain **node server** that makes it unreachable from the outside. This is where the usage of nginx becomes irreplaceable.
- In order to test bugfixes, the only way is to modify the code and rebuild the image in the **dev environment containerized configuration**.

---

## **Development Containerized Environment**

<span style="color: red"> This has to be used only for bugfixes on the containerized image that will be then used for production </span>

### Build the image

```
docker-compose build
```

### Run the container in dev mode

Note: dev mode here replicates the production environment, since this configuration purpose is to debug the deployed application. The only change here is the image name, which is used to differentiate this image from the official prod image from the container registry on gitlab.

```
docker-compose up -d
```

---

## **Environment Variables**

### Development

Simply declare your variables in `.env` file

<span style="color: red">Variables must follow the naming convention: **VITE_VARIABLE_NAME**</span>
<span style="color: red">New variables are only seen upon **Node** Server restart</span>

### Production

Since production code is precompiled, variables cannot be easily changed on-the-fly. This project follows a strategy presented in https://medium.com/js-dojo/vue-js-runtime-environment-variables-807fa8f68665

The idea is to use the entrypoint to look for regular expressions coinciding with env vars names and substitute them with values coming from the .env file.
Each new variable needed in the project requires a new image build. For already existing variables, on the other hand, the value can be changed within `.env*` files and it is immediately reflected upon container restart.

**Make sure to add the script placeholder in public/index.html otherwise the env vars compilation will not end up in the final js code**

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
