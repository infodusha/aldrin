# Changelog

## [0.2.0](https://github.com/infodusha/aldrin/compare/aldrin-v0.1.2...aldrin-v0.2.0) (2022-12-26)


### ⚠ BREAKING CHANGES

* **core:** rxjs now peer dependency

### Features

* **core:** create shared state hook ([badd88d](https://github.com/infodusha/aldrin/commit/badd88ddaec7c10c27670d18d2f50b087b749173))
* **core:** partially create Show component ([cc15f5a](https://github.com/infodusha/aldrin/commit/cc15f5ae5e5929f470f2f78fbb8bd7d55c12607b))
* **core:** refactor connections & store ([742111f](https://github.com/infodusha/aldrin/commit/742111f61b9c0252aab9bd4b4f9d0ae534677396))
* **core:** rxjs now peer dependency ([89d9229](https://github.com/infodusha/aldrin/commit/89d922962f91600fea6a57fdf3cde6591121f946))
* **core:** use rxjs instead of event emitter ([2445d5f](https://github.com/infodusha/aldrin/commit/2445d5fef298b022e5b1463db940f1cbbdc12a68))
* **helpers:** refactor to use context ([2ebb0fc](https://github.com/infodusha/aldrin/commit/2ebb0fce8ae3692b1b474ec306a32cda9e290410))


### Bug Fixes

* **core:** fixup tests ([638b360](https://github.com/infodusha/aldrin/commit/638b36097ae9bb3453b00ce4fb5a97e07f39319d))
* **core:** refactor any on unknown ([5e5ed2d](https://github.com/infodusha/aldrin/commit/5e5ed2d8bd365e4d33d7977a78ebdee406af11e6))
* **core:** remove memory leak in bindReactiveProp ([6f7f48f](https://github.com/infodusha/aldrin/commit/6f7f48fcb373feed56beb7c109fcc092b27cb9d6))
* **core:** useEffect's cleanup should run onChange as well ([c69e696](https://github.com/infodusha/aldrin/commit/c69e696f86c32ca559323acedaed965c5f4eb3f0))
* **core:** uuid in no more needed in context ([7ea4bba](https://github.com/infodusha/aldrin/commit/7ea4bba58e5e66bbcbcae66b326c728586353426))
* **test:** a try to update vitest ([8d905d1](https://github.com/infodusha/aldrin/commit/8d905d1ea0053bd81d4723fcb152bc6a7f1e3a64))
* **test:** a try to update vitest 2 ([7f31858](https://github.com/infodusha/aldrin/commit/7f31858158ce3b186b204a4c24c9097cc9f51617))
* **test:** a try to update vitest 3 ([470a373](https://github.com/infodusha/aldrin/commit/470a3739de3e28ac5784c00ef436d3d742c1597a))

## [0.1.2](https://github.com/infodusha/aldrin/compare/aldrin-v0.1.1...aldrin-v0.1.2) (2022-12-22)


### Features

* **core:** add useEffect hock ([4d6cf37](https://github.com/infodusha/aldrin/commit/4d6cf37511d2439323a8dfbaf0ad93cab245ec3a))
* **core:** add watch hook ([d98d4c0](https://github.com/infodusha/aldrin/commit/d98d4c0b97a83eba9c8a178eecb3dc7b650929d1))
* **core:** escape strings & unsafe function ([610ace7](https://github.com/infodusha/aldrin/commit/610ace7727c0a6c43ac888a86fd3429826b75470))
* **core:** props can be reactive ([da56684](https://github.com/infodusha/aldrin/commit/da56684e0764f0befe7c43364a7653558bbc4d3a))
* **core:** refactor renderer ([957196b](https://github.com/infodusha/aldrin/commit/957196b700139265155af77aa6478a3909d7e094))


### Bug Fixes

* **build:** remove sourcemap & fix readme publish ([9e36307](https://github.com/infodusha/aldrin/commit/9e36307ad93a62f71f481f04c3f055d52b5a43a6))
* **useEffect:** check if unMount is function ([9417329](https://github.com/infodusha/aldrin/commit/9417329601958a18c1d2de2aee2c06ab0f1e133f))

## [0.1.1](https://github.com/infodusha/aldrin/compare/aldrin-v0.1.0...aldrin-v0.1.1) (2022-12-17)


### Features

* **core:** add vitest ([f634482](https://github.com/infodusha/aldrin/commit/f634482030fcd17ce3de0efaeb192d32f7dfc328))
* **core:** async components ([1b9c1e6](https://github.com/infodusha/aldrin/commit/1b9c1e6f7a795a41c62e19e8bbf65ddc270cbf50))
* **core:** config has defaults ([3e58ea6](https://github.com/infodusha/aldrin/commit/3e58ea62edff27b4f5f2d556a6590b8ff57d12a5))
* **core:** config refactor + optional ([0c189c8](https://github.com/infodusha/aldrin/commit/0c189c842a83e83aa48a935c8d414e0e8ccda999))
* **core:** reactive and computed ([0ef321d](https://github.com/infodusha/aldrin/commit/0ef321de8b53fc9ad80a384eeaf4b310aafaa574))
* **core:** reactive and computed ([f7e1e99](https://github.com/infodusha/aldrin/commit/f7e1e99f12930c08e9954c1cef6edc42ad09a795))
* **core:** refs not needed ([e3303e1](https://github.com/infodusha/aldrin/commit/e3303e1d33bd430fb3ae2ece353ae29a6679b977))
* **core:** state can be computed + render per person ([7bcb379](https://github.com/infodusha/aldrin/commit/7bcb379567cd06cabca64d4d3df845af7a98e51c))
* **test:** add test in ci ([d20d86c](https://github.com/infodusha/aldrin/commit/d20d86c5cf4bfdb46e9c3ad4131e9ed82339e39d))


### Bug Fixes

* **computed:** small refactor ([eb7e69e](https://github.com/infodusha/aldrin/commit/eb7e69e6b49e674831a62cf603828e585f0c4d4d))
* **connections:** cleanup render context on connection ([b04dab1](https://github.com/infodusha/aldrin/commit/b04dab152b1c43232a9b8e2c3ed86565d6bb200b))
* **connection:** set type module for isolation ([3738087](https://github.com/infodusha/aldrin/commit/3738087aaf83ec52bee22fa8759ead4d174585c5))
* **core:** make mount hook simple ([4aec8db](https://github.com/infodusha/aldrin/commit/4aec8dbb5321c4444899ddbae8744dc9a04b9e32))
* **core:** refs not needed ([6147177](https://github.com/infodusha/aldrin/commit/614717784abc63cb6885082bf8809cc9a301b7fb))
* **reactive:** refactor ([ca457fc](https://github.com/infodusha/aldrin/commit/ca457fcfc1a8697a52745a9afca8382478b20bb8))
* **reactive:** remove AnyFunction type ([237096f](https://github.com/infodusha/aldrin/commit/237096ff22cbf8b4b0db25d4416410f5ae8fe86c))
* **reactive:** update only target ([4cfe48f](https://github.com/infodusha/aldrin/commit/4cfe48fd2553f132bfd4b4f7e39ac6be1b946e62))
* **script:** add protocol and location ([bb64e53](https://github.com/infodusha/aldrin/commit/bb64e530a64fd6a6f0bbbceff51b776a6803d5a2))
* **single-event-emitter:** remove loops ([d946e92](https://github.com/infodusha/aldrin/commit/d946e92b835543ac8b4a90ad989aca54621429ef))

## [0.1.0](https://github.com/infodusha/aldrin/compare/aldrin-v0.0.10...aldrin-v0.1.0) (2022-11-17)


### ⚠ BREAKING CHANGES

* **app:** release

### Bug Fixes

* **app:** release ([f710202](https://github.com/infodusha/aldrin/commit/f710202c9b420346aefeb6cbdda9bd9324f36f62))

## [0.0.10](https://github.com/infodusha/aldrin/compare/aldrin-v0.0.9...aldrin-v0.0.10) (2022-11-17)


### Bug Fixes

* **ci:** move folders back ([fbae034](https://github.com/infodusha/aldrin/commit/fbae034c266e7654bcb8ef3e3bfc73efd3f5a423))

## [0.0.9](https://github.com/infodusha/aldrin/compare/aldrin-v0.0.8...aldrin-v0.0.9) (2022-11-17)


### Bug Fixes

* **ci:** move folders back ([01dc4b9](https://github.com/infodusha/aldrin/commit/01dc4b9701d8deb99511660eb0d637164c795ba5))

## [0.0.8](https://github.com/infodusha/aldrin/compare/aldrin-v0.0.7...aldrin-v0.0.8) (2022-11-17)


### Bug Fixes

* **ci:** move folders back ([9fd949b](https://github.com/infodusha/aldrin/commit/9fd949ba4498d179a3ab8b17aaae8c4791e606e7))

## [0.0.7](https://github.com/infodusha/aldrin/compare/aldrin-v0.0.6...aldrin-v0.0.7) (2022-11-17)


### Bug Fixes

* **ci:** move folders back ([1a88ba0](https://github.com/infodusha/aldrin/commit/1a88ba0e5746650b216b726f1929b1bb8548c39d))

## [0.0.6](https://github.com/infodusha/aldrin/compare/aldrin-v0.0.5...aldrin-v0.0.6) (2022-11-17)


### Bug Fixes

* **ci:** releases ([a579502](https://github.com/infodusha/aldrin/commit/a57950206b091bda761f35322a625d65f89ea98e))

## [0.0.5](https://github.com/infodusha/aldrin/compare/aldrin-v0.0.4...aldrin-v0.0.5) (2022-11-17)


### Features

* test ci 4 ([36e159e](https://github.com/infodusha/aldrin/commit/36e159e578ef19293a039163482d6bdfc51e9034))

## [0.0.4](https://github.com/infodusha/aldrin/compare/aldrin-v0.0.3...aldrin-v0.0.4) (2022-11-17)


### Features

* test ci 3 ([d796c29](https://github.com/infodusha/aldrin/commit/d796c299179c66a81c1450f39452a0edbb13cd08))

## [0.0.3](https://github.com/infodusha/aldrin/compare/aldrin-v0.0.2...aldrin-v0.0.3) (2022-11-16)


### Features

* create readme symlink ([3cdc426](https://github.com/infodusha/aldrin/commit/3cdc426e5d224d3eb487197d8f29a9438e2097df))

## [0.0.2](https://github.com/infodusha/aldrin/compare/aldrin-v0.0.1...aldrin-v0.0.2) (2022-11-16)


### Features

* **app:** move to package directory ([4d1c72a](https://github.com/infodusha/aldrin/commit/4d1c72af1d55a47c4c180ea849e088eb4384e001))
* **app:** move to package directory ([be299f3](https://github.com/infodusha/aldrin/commit/be299f3bd0b4db27b01124e19adfaf642199c3ca))
* **app:** partial refactor ([c04886c](https://github.com/infodusha/aldrin/commit/c04886c6d129d3f6632444e0a6f7219c8589dde7))
* cleanup dead code ([be308e2](https://github.com/infodusha/aldrin/commit/be308e2aa4ea3d432939c235da8bb152099888b3))
* make state work ([4a2b003](https://github.com/infodusha/aldrin/commit/4a2b003fc9d0816ebbcab6f8a924cdac0c7f973d))
* **render:** refactor ([a8c238c](https://github.com/infodusha/aldrin/commit/a8c238cefbcfe3c9b2108cbca1ce4186ed466b78))
