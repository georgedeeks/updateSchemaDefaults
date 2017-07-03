# Update Schema Defaults

Program that will update our translations based on latest URL or file upload.

## Get started

Only the output flag is required at present.

Currently there is an established domain-path that we fetch translations from:

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
