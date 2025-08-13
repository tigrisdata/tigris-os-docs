#!/usr/bin/env bash

# go install github.com/asdf-vm/asdf/cmd/asdf@v0.18.0

# echo 'export PATH="${ASDF_DATA_DIR:-$HOME/.asdf}/shims:$PATH"' >> ~/.zshrc
# mkdir -p "${ASDF_DATA_DIR:-$HOME/.asdf}/completions"
# asdf completion zsh > "${ASDF_DATA_DIR:-$HOME/.asdf}/completions/_asdf"

# echo 'fpath=(${ASDF_DATA_DIR:-$HOME/.asdf}/completions $fpath)
# autoload -Uz compinit && compinit' >> ~/.zshrc

npm ci
# asdf plugin add erlang
# asdf plugin add elixir
# asdf install

npm install -g @google/gemini-cli
