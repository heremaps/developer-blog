
# HERE Coronavirus tracker

Once you have cloned the repo, run the install:

```
npm install
```

or...

```
yarn install
```

You will have to reference the right spaces and have access keys to be able to run this app. Create a `.env.development` file with the following variables:

> Note that I have left the access token and the space ids in here. For the api key any valid HERE api key should do.

```
GATSBY_API_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
GATSBY_ACCESS_TOKEN=*****
GATSBY_SPACE_ID=****
GATSBY_PROVINCES_SPACE_ID=****
GATSBY_PROVINCE_BORDERS_SPACE_ID=****
```

If you are building the site for production, make sure that you call your env file `.env.production`.

You can build the site with:

```
yarn run build
```

or

```
npm run build
```

If you are building your site prefixed, use:

```
yarn run buildPrefixed
```

or

```
npm run buildPrefixed
```

See more about prefixed builds here:
https://www.gatsbyjs.org/docs/path-prefix/

Once built, the site (`public` folder) is a simple static site and can be deployed on any static server.
