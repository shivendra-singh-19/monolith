FROM node:22-alpine

ENV PROJECT_HOME=/usr/app/

# RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
USER node

WORKDIR ${PROJECT_HOME}

COPY --chown=node:node package*.json ${PROJECT_HOME}

RUN  npm install --only-production \
    && chown -R node:node .

COPY --chown=node:node . $PROJECT_HOME

RUN npm run build

EXPOSE 8080

ENV NAME e-commerce

CMD ["npm", "run", "dev"]