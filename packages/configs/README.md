# @sytizen/configs

Configuration files for sytizen packages.

## Installation

```sh
npm add -D @sytizen/configs
```

## Usage

### Biome

Add the following in your `biome.json`:

```json
{
	"$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
	"extends": ["@sytizen/configs/biome.json"]
}
```

### TypeScript

#### Base

Add the following in your `tsconfig.json`:

```json
{
	"$schema": "https://www.schemastore.org/tsconfig.json",
	"compilerOptions": {
		"outDir": "dist",
		"rootDir": "."
	},
	"exclude": ["dist", "node_modules", "**/*.test.*"],
	"extends": ["@sytizen/configs/tsconfig/base.json"]
}
```

#### Lib

Add the following in your `tsconfig.json`:

```json
{
	"$schema": "https://www.schemastore.org/tsconfig.json",
	"compilerOptions": {
		"outDir": "dist",
		"rootDir": "src"
	},
	"exclude": ["dist", "node_modules", "**/*.test.*"],
	"extends": ["@sytizen/configs/tsconfig/lib.json"]
}
```

## License

MIT. See [LICENSE](./LICENSE) for more information.
