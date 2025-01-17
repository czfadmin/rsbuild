- **Type:**

```ts
type ProgressBar =
  | boolean
  | {
      id?: string;
    };
```

- **Default:** `process.env.NODE_ENV === 'production'`

Whether to display progress bar during compilation.

By default, Rsbuild only enables the progress bar when production building.

- **Example:** Enable the progress bar.

```js
export default {
  dev: {
    progressBar: true,
  },
};
```

- **Example:** Disable the progress bar.

```js
export default {
  dev: {
    progressBar: false,
  },
};
```

- **Example:** Modify the progress bar `id`

If you need to modify the text displayed on the left side of the progress bar, you can set the `id` option:

```ts
export default {
  dev: {
    progressBar: {
      id: 'Some Text',
    },
  },
};
```
