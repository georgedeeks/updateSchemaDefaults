# Update Schema Defaults

Program that will update our translations based on latest URL or file upload.

## Get started

Only the output flag (-o) is a required option at present. Use terminal to see all options.

Currently there is a default established domain-path that we fetch translations from:

https://m.133a.lolacloud.com/services/translations/sub_project_translations/mobileBooking.json

### Example usage:

```
npm run usd -- --output './output.json'
```

## Testing

```
npm run test
```

This will run the mock-data tests.
