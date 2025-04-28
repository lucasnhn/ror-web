[Back to README](README.md)

# How to - clone and run ROR

To run ROR with the new web, you need to run [ror](https://github.com/NorskHelsenett/ror) and [ror-web](https://github.com/NorskHelsenett/ror-web). ror-web is the frontend, while ror is the backend. Therefore, if you try to run ror-web without ror, you just won't get any data.

## Clone ror repo

- In the [ror repo](https://github.com/NorskHelsenett/ror), find the green "Code" button, and choose SSH. If you have not set up SSH, do so instead of cloning with HTTPS, as this will save you problems later.

![image](https://github.com/user-attachments/assets/cd737024-b01d-48cc-b5e1-c3dc1f0e2f67)

- Copy the text `git@github.com:NorskHelsenett/ror.git`.
- In a terminal, navigate to the directory you want your repo to be in, and enter `git clone git@github.com:NorskHelsenett/ror.git`.

## Clone ror-web repo

- In the [ror-web repo](https://github.com/NorskHelsenett/ror-web), find the green "Code" button, and choose SSH. If you have not set up SSH, do so instead of cloning with HTTPS, as this will save you problems later.

![image](https://github.com/user-attachments/assets/43d8eded-d74b-4f1e-afd1-5b38fd4b7698)

- Copy the text `git@github.com:NorskHelsenett/ror-web.git`.
- In a terminal, navigate to the directory you want your repo to be in, and enter `git clone git@github.com:NorskHelsenett/ror-web.git`.

## Run ror

The ror developers present this [official documentation](https://norskhelsenett.github.io/ror/getting-started/). While I try to give you a simple guide, I might have missed something, and I would then refer to their documentation.

- Have docker running
- In the root level of the repo, enter `./r.sh` in a terminal

## Run ror-web

- In the `ror-web/apps/web` directory, create a `.env.local` file and add environment variables
- In the root directory, run `npm i`
- In the root directory, run `npm run dev`
- Go to [http://localhost:11100](http://localhost:11100)
