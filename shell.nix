{ pkgs ? import <nixpkgs> {} }:
with pkgs;

let
  extensions = (with pkgs.vscode-extensions; [
      bbenoist.Nix
      eamodio.gitlens
      esbenp.prettier-vscode
    ]) ++ pkgs.vscode-utils.extensionsFromVscodeMarketplace [
      {
          name = "vscode-jest";
          publisher = "orta";
          version = "4.0.3";
          sha256 = "1skb0gxpx7lra48mcf8j7y4yqkxhfi6pabrjn8i9vxap0jb16hvv";
      }
      {
          name = "vscode-jest-runner";
          publisher = "firsttris";
          version = "0.4.44";
          sha256 = "1pbhajg5vicsgn3gkxh8gmp17mqzh76s7zf7l7886gzn7w3l71a2";
      }
      {
          name = "vscode-coverage-gutters";
          publisher = "ryanluker";
          version = "2.8.1";
          sha256 = "1hq6zwb94gaz7y82zk4s9q0gqxd180xs1pd4mfc2v0iyv1x3rkac";
      }
  ];
  vscode-with-extensions = pkgs.vscode-with-extensions.override {
      vscodeExtensions = extensions;
    };
in mkShell {
  buildInputs = [
    pkgs.nodejs
    pkgs.yarn
    pkgs.git
    vscode-with-extensions
  ];
}