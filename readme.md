<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">

  <h1 align="center">Ghost-Notifier</h1>

  <a href="https://dev.to/devteam/mongodb-atlas-hackathon-2022-winners-announced-iib">
    <div align="center">
      <img height="120" width="120" src="https://res.cloudinary.com/practicaldev/image/fetch/s--Rc2eEGZs--/c_limit,f_auto,fl_progressive,q_80,w_180/https://dev-to-uploads.s3.amazonaws.com/uploads/badge/badge_image/207/mongowinner.png" />
      <p>Winner of the MongoDB Hackathon 2022 on dev.to</p>
    </div>
  </a>

  <p align="center">
    Realtime notifications for your Ghost Blog
  </p>
  <div align="center">
    <img alt="License" src="https://img.shields.io/github/license/tq-bit/ville-de-cuisines?style=plastic&logo=MIT"/>
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/tq-bit/ghost-notifier?style=plastic&logo=git"/>
  </div>
</div>

## About the Project

This project is a selfhosted MVP for realtime notifications in [Ghost CMS](https://ghost.org/). It's my submission to the [2022 MongoDB hackathon on dev.to](https://dev.to/devteam/announcing-the-mongodb-atlas-hackathon-2022-on-dev-2107).

Ghost Notifier is built on top of MongoDB ChangeStreams and Ghost webhooks to deliver notifications whenever a new article is published or an existing article is updated.

[![ghost-notifier landing page][product-screenshot]](#)

### Built With

- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Typescript / Javascript](https://www.typescriptlang.org/)
- [Handlebars](https://handlebarsjs.com/guide/)
- feat. [Ghost CMS](https://ghost.org/)
- feat. [LaMetric](https://lametric.com/)


## Get started

I've added to alternate ways for your to give this application a ride:

- Simulate Ghost Webhooks with a HTTP client and check the app logs on localhost:3000/ (the 'Simulation approach')
- Start a Ghost Instance locally, register webhooks and the frontend library (the 'Ghost approach')

In the following, I'll explain both in greater detail.

### Quickstart

Start by cloning this repos into a folder of your choice and renaming the `.env.example` file to `.env`:

```sh
# http
git clone https://github.com/tq-bit/ghost-notifier.git

# ssh
git clone git@github.com:tq-bit/ghost-notifier.git

# Rename env file
cp .env.example .env
```

Rename the `.env.example` into `.env` file and add your [MongoDB atlas](https://www.mongodb.com/atlas) credentials.

> You can find the username, password and URL in your MongoDB Atlas console

```sh
MONGO_HOST="mongodb+srv://<atlas-user>:<atlas-password>@<atlas-url>/?retryWrites=true&w=majority"
MONGO_USER=<atlas-user>
MONGO_PASSWORD=<atlas-password>
```

Next, open a terminal and type

```sh
$ npm install
$ npm run dev
```

This will start the application at http://localhost:3000. When you open your browser, you'll see a log of incoming messages.

![](https://raw.githubusercontent.com/tq-bit/ghost-notifier/master/assets/images/ghost-notifier-ui-empty.png)

It's still empty, so let's look how we can fill it up to look more like this:

![](https://raw.githubusercontent.com/tq-bit/ghost-notifier/master/assets/images/ghost-notifier-ui.png)


### The Simulation approach

For this approach, you'll need an HTTP client. I recommend you to use the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) VSCode plugin from the marketplace.

Head over to the [`examples/simulation` folder](https://github.com/tq-bit/ghost-notifier/tree/master/examples/simulation/payloads). If you're using the plugin, you can use the `notification.rest` file to send the requests with the matching payload. If you're using a client like Postman, you can grab the create and update paylods from the `payloads` folder:

- [Create a new post](https://github.com/tq-bit/ghost-notifier/blob/master/examples/simulation/payloads/create-post.json)
- [Update an existing post](https://github.com/tq-bit/ghost-notifier/blob/master/examples/simulation/payloads/update-post.json)

After sending the paylods, check your application at http://localhost:3000/ and you should see a new entry added to the list.

### The Ghost approach

If you want to see the full example, you'll need to start a Ghost instance locally. I've added a basic `docker-compose` file to the project for you to get started with. If you'd like to install Ghost manually or you get stuck during the installation, please follow the [official docs here](https://ghost.org/docs/install/)

#### Starting a Ghost Instance

Open up a terminal and type

```sh
# Using the binary
docker-compose up

# Using the plugin
docker compose up
```

Then, open your browser at http://localhost:2368/ghost/. After activating your site, you can start creating the necessary webhooks and inject the frontend library with [Ghost's code injection feature](https://ghost.org/tutorials/use-code-injection-in-ghost/)

#### Create the webhooks

Ghost can be configured to send HTTP POST requests to a custom URL when an event occurs. We'll use this feature to insert a notification into MongoDB whenever

- A new post is published
- A published post is updated

Before adding the webhooks, you must create a new custom integration under `http://localhost:2368/ghost/#/settings/integrations`

![](https://raw.githubusercontent.com/tq-bit/ghost-notifier/master/assets/images/ghost-notifier-create-integration.gif)

Let's add the create - webhook first.

> Ghost is a serverside process in a docker container, so you cannot use http://localhost:3000, but must the IP address of your machine in your local network. You can use `ifconfig` on UNIX systems or `ipconfig` on Windows to find it out.

- Name: Ghost-Post-published
- Event: Post published
- URL: -IP-address of your computer in your network-:3000/api/article/publish

![](https://raw.githubusercontent.com/tq-bit/ghost-notifier/master/assets/images/ghost-notifier-create-integration.gif)

Next, add the update - webhook:

- Name: Ghost-Post-updated
- Event: Post updated
- URL: -IP-address of your computer in your network-:3000/api/article/update

![](https://raw.githubusercontent.com/tq-bit/ghost-notifier/master/assets/images/ghost-notifier-create-webhook-update.gif)

You can check whether the webhooks work by creating a new post under http://localhost:2368/ghost/#/editor/post and updating it. The log on http://localhost:3000 will receive a new entry with every create/update.

#### Registering the Frontend Library

Finally, we want the readers to see these notifications as well. Since Ghost is a headless CMS, the clientside UI implementation always depends on the use case. I've decided to add a small piece of Javascript that adds a notification button + dropdown to Ghost's default theme `Casper`. It's served by Ghost-Notifier under the static path `/plugin`

Assuming your Ghost-Notifier runs on post http://localhost:3000/, you can use [Ghost's code injection](https://ghost.org/tutorials/use-code-injection-in-ghost/) to automatically load the library like this:

- Head to http://localhost:2368/ghost/#/settings/code-injection
- In the Site Header section, add the following:


```html
<link href="http://localhost:3000/plugin/ghost-plugin.css" rel="stylesheet">
```

- In the Site Footer section, add

```html
<script src="http://localhost:3000/plugin/ghost-plugin.js"></script>
```

Open http://localhost:2368/ again. You should see a small bell-icon in the upper right corner. Try and publish a post now and you'll see a small right badge on the top right. Click on the button and you'll receve a list of post update notifications.


### Connect to LaMetric (optional & limit to local network)

LaMetric is a smart home device that can receive HTTP calls from inside a network. I've added a small bit of [optional code in the noficiation.listener file](https://github.com/tq-bit/ghost-notifier/blob/master/src/realtime/notification.listener.ts#L93) that connects to LaMEtric and sends a new notification whenever a webhook is triggered. I've also recorded a brief video to showcase its funtionality. You can check it out on Youtube: https://youtube.com/shorts/Mdwa-9BS4W4 or try it yourself if you have the hardware.

To activate this feature, add the following two variables to your `.env` file:

```sh
LAMETRIC_IP=<la-metric-ip-address>   # e.g. 192.168.1.123:8080
LAMETRIC_API_KEY=<la-metric-api-key> # See https://developer.lametric.com/ for more info
```

<!-- LICENSE -->
## License

Licensed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Please tell me how you liked the submission. You can reach me on Twitter or on [dev.to](https://dev.to/tqbit)


Mail: [tobi@q-bit.me](mailto:tobi@q-bit.me) - Twitter: [@qbitme](https://twitter.com/qbitme)

Project Link: [https://github.com/tq-bit/ghost-notifier](https://github.com/tq-bit/ghost-notifier)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments



<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[product-screenshot]: assets/images/ghost-notifier-update.gif
