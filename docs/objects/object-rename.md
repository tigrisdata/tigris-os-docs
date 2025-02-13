# Renaming Objects

Tigris Dashboard allows you to rename files/objects.

## Renaming Objects using the Dashboard

To rename files or objects using the Tigris console, follow these steps.

Here is a step-by-step visual guide:

1. **Open the Tigris Console**: Go to
   [Tigris Console](https://console.tigris.dev/) and log in.
2. **Go to the Buckets Section**: In the side navigation, click on "Buckets".
   Select the desired bucket and locate the file you want to rename. Click the
   "Rename" option from the action menu next to the file.

![Tigris File Browser](/img/rename-obj-step-1.png)

3. **Enter the New Name**: Type the new name in the provided input field.
   ![Tigris Rename Object Popup](/img/rename-obj-step-2.png)

4. **Confirm the Rename**: Click "Save" to apply the new name.
5. **Verify the Change**: Check the list to ensure the object/file has been
   updated.

![Tigris Rename Object Success modal ](/img/rename-obj-step-3.png)

## Renaming Objects using AWS CLI

To rename an object using AWS CLI, include an additional header. This header
informs Tigris to perform a rename operation instead of a copy.
`X-Tigris-Rename: True`

```
aws s3api copy-object --bucket destination-bucket --copy-source source-bucket/source-key --key destination-key
```

For example: If you want to rename `file-1.txt` to `file-2.txt` in the bucket
`my-files-collection`

```
aws s3api copy-object --bucket my-files-collection --copy-source my-files-collection/file-1.txt --key file-2.txt --metadata-directive REPLACE --metadata X-Tigris-Rename=True
```
