# hurricane-tracker-idalia-2023

## Dependencies

This project depends on NodeJS, and currently suppports version 16.15.0 and above. It also depends on the [gsutil command line tool](https://cloud.google.com/storage/docs/gsutil_install).


## Start running project locally

Once the project has been cloned, first install the dependencies with:
```console
npm install
```

Then, to run the local development server, run:
```console
npm start
```

## Configuring your graphic

The `graphicconfig.yml` file provides some basic configuration for each project. This can be a useful place to store project metadata such as page title, description, publish date, and authors. Those are all optional and can be used or ignored. The only required information in this file is the `indepth-embeds` array. Each item in this array will result in a seperate output during the build process. The fields for each output are currently: 

field | type | description
--- | --- | ---
`name` | `string` | build process will look for `src/<filename>.html` and will output a module based on these files
`component` | `string` | specifies the name of a Svelte component to use for server-side-rendering. The corresponding file should be located at `src/<component>`
`content` | `string` | specifies a JSON file to use when server-side-rendering a module. File should be located at `src/<content>` and contents will be passed to the specified `component` as a property called `content`

## Deploying

To deploy to USA TODAY's CDN, in the production folder, run
```console
npm run deploy
```

This will build production ready files and upload them. 

Gannett CDN credentials must be stored as a keyfile in your user folder for this to work, and you must define `$CDN_AUTH` as an environment variable in order to bust cache. If you do not have these things, talk to Mitchell Thorson about getting setup.

You can also deploy to the dev target folder with:
```console
npm run deploy:dev
```

Assets for this project will be deployed to:

https://www.gannett-cdn.com/experiments/storytelling-embed/$BRANCH/hurricane-tracker-idalia-embed-2023

where $BRANCH is either `dev` or `master`, depending on the deployment target.
