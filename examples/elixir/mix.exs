defmodule GettingStarted.MixProject do
  use Mix.Project

  def project do
    [
      app: :tigrisexample,
      version: "0.1.0",
      elixir: "~> 1.18",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      extra_applications: [:logger]
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:ex_aws, "~> 2.0"},
      {:ex_aws_s3, "~> 2.0"},
      {:httpoison, "~> 2.1"},
      {:poison, "~> 3.0"},
      {:hackney, "~> 1.9"},
      {:sweet_xml, "~> 0.6.6"},
      {:jason, "~> 1.1"},
      {:uuid, "~> 1.1"}
    ]
  end
end
