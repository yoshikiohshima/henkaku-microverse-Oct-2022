// Copyright 2022 by Croquet Corporation, Inc. All Rights Reserved.
// https://croquet.io
// info@croquet.io

export function init(Constants) {
    Constants.AvatarNames = [
        "newwhite"
    ];

    Constants.UserBehaviorDirectory = "behaviors/default";
    Constants.UserBehaviorModules = [
        "lights.js", "flip.js", "throb.js", "earth.js", "spin.js",
        "sound.js",
        "spatialSound.js"
    ];

    Constants.DefaultCards = [
        {
            card: {
                name: "world model",
                dataScale: [9, 9, 9],
                dataTranslation: [108, -17.5, -128],
                dataRotation: [0, Math.PI / 12 * 5, 0],
                // dataTranslation: [22, -10.7, -20],
                layers: ["walk"],
                type: "3d",
                dataLocation: "3Ep4wIDFLOzFTJAw0JPxevGXaAv1FM_VZ1jSCqYN7R4ELTExNTZ_amojLCkgNmswNmsmNyo0MCAxaywqajBqAiETJzwpDDYELhQmBx0hdgI9JDM8MhAOEhwcd2osKmsmNyo0MCAxaygsJjcqMyA3NiBqEXAGci8jHHMhFg8JLgwVADwwMTU1CjcsCj8Rd3c9M3J8DCcXN3x3LTFwHGohJDEkaicHfCd3KXYsDAMyCxQENgILHHwLPQo2DHIgKzYCdHANBjQEInEBLQFycnE",
                modelType: "glb",
                singleSided: true,
                shadow: true,

                placeholder: false,
                placeholderSize: [100, 0.01, 100],
                placeholderColor: 0xcccccc,
                placeholderOffset: [0, -1.7, 0],

            }
        },
        {
            card: {
                name: "light",
                layers: ["light"],
                type: "lighting",
                behaviorModules: ["Light"],
                dataLocation: "3OF2-s4U1ZOJduGATmLEIXo1iTkQHd5ZBknKgL5SvqpQJzs7Pzx1YGApJiMqPGE6PGEsPSA-Oio7YSYgYDpgCCsZLTYjBjwOJB4sDRcrfAg3Ljk2OBoEGBYWfWAmIGEsPSA-Oio7YSImLD0gOSo9PCpgPwB9AAIIISx8YiYneScqKyQaIisNLHkaGT8YKg56JQwQfHstPiNiGQ49e2ArLjsuYCMBPgMiCQt3OQskGhcleSp9HQIIfXseHgo7EAo9CB48FRwpegsCLH4OIwY",
                dataType: "jpg",
                fileName: "/abandoned_parking_4k.jpg"
            }
        },
        {
            card: {
                name: "heart",
                translation: [-1.2, -0.8, -10],
                dataScale: [0.36, 0.36, 0.36],                
                dataLocation: "3VhGaiwqCXp9onQlhdpqfE3xlVGf-FrzHywntXhDSayAPiIiJiVseXkwPzozJXgjJXg1JDknIzMieD85eSN5LAMiIQYZLBAjGQVnHT8xGww_Y2VvLhASEW5mZHk_OXg1JDknIzMieDs_NSQ5IDMkJTN4Ojk1NzoyMyAyMzA3IzoieTM7GRMCMWEbZj4kJRNmZSYCHw83PSMgPmYmMWAJFzQEOR8dBWIjPhliLj15MjciN3k9bmMdY3sZEBcSJwMEDgMBIjISEmcOODcEZQJ7LAM4by8-MDV7YjgBGxQ1",
                type: "3d",
                modelType: "glb",
                behaviorModules: ["Throb"],
                layers: ["pointer"],
            }
        },
        {
            card: {
                name: "earth",
                translation: [7.7, 0.4, -10],
                scale: [0.3, 0.3, 0.3],
                type: "object",
                behaviorModules: ["Earth", "SingleUser", "SingleUserSpin"],
                layers: ["pointer"],
                color: 0xaaaaaa,
            }
        },
        {
            card: {
                name: "image", 
                translation: [12, 0.2, -1],
                scale: [3, 3, 3],
                rotation: [0, 1.5, 0],
                layers: ["pointer"],
                cornerRadius: 0.02,
                fullBright: true,
                shadow: true,
                singleSided: true,
                textureLocation: "3lEmUYiLjAOUZ5xR88MDOsiJYO_VyHrShp6weTF73X4YBBgYHB9WQ0MKBQAJH0IZH0IPHgMdGQkYQgUDQxlDFjkYGzwjFioZIz9dJwULITYFWV9VFCooK1RcXkMFA0IPHgMdGQkYQgEFDx4DGgkeHwlCAAMPDQAICRoICQoNGQAYQwkBIyk4C1shXAQeHylcXxw4JTUNBxkaBFwcC1ozLQ4-AyUnP1gZBCNYFAdDCA0YDUMfGi9ZNS4fFQQeBxYePANYWClUWQYUNVoiJQYqXxwoGR0DGR4qGwQqWTQf",
                textureType: "image",
                type: "2d",
                behaviorModules: ["Flip"],
            }
        },
        {
            card: {
                name: "sound", 
                translation: [9.723372367306075, -0.09185165312189325, -3.936244636352034],
                rotation: [0, -0.3057008931973436, 0, 0.952127598538319],
                fullBright: true,
                type: "2d",
                width: 1,
                height: 1,
                //soundLocation: "./assets/sound/doremi.mp3",
                soundLocation: "3aRXOosX4C-yOBW9YZ7wJtjRHf_jlULX159Pxz4YFT9ACRUVERJbTk4HCA0EEk8UEk8CEw4QFAQVTwgOThROGzQVFjEuGycULjJQKggGLDsIVFJYGSclJllRU04IDk8CEw4QFAQVTwwIAhMOFwQTEgRPDQ4CAA0FBBcFBAcAFA0VTjYVVzskJzVYDhsRJywNJSM4NjklK1IkBQ8wFCkkIDECGTNQV0wyCwQULDhOBQAVAE5TNRQZERFVEyMqWTgTTBQGFRk1ESYFKyMTBVhWNDECByI5KjMwCjlQJwIG",
                behaviorModules: ["SoundPlayer", "AudioMenu"],
                layers: ["pointer"],
                dataLocation: "./assets/SVG/8thNote.svg",
                modelType: "svg",
                color: 0xffffff,
                // loop: true,
            }
        },
        {
            card: {
                name: "sound 2",
                translation: [-5.3676383195648, 0.5212626335581853, -5.309069882418509],
                rotation: [0, 0.2886716203634535, 0, 0.9574281673299246],
                fullBright: true,
                type: "2d",
                width: 1,
                height: 1,
                //soundLocation: "./assets/sound/doremi.mp3",
                soundLocation: "3aRXOosX4C-yOBW9YZ7wJtjRHf_jlULX159Pxz4YFT9ACRUVERJbTk4HCA0EEk8UEk8CEw4QFAQVTwgOThROGzQVFjEuGycULjJQKggGLDsIVFJYGSclJllRU04IDk8CEw4QFAQVTwwIAhMOFwQTEgRPDQ4CAA0FBBcFBAcAFA0VTjYVVzskJzVYDhsRJywNJSM4NjklK1IkBQ8wFCkkIDECGTNQV0wyCwQULDhOBQAVAE5TNRQZERFVEyMqWTgTTBQGFRk1ESYFKyMTBVhWNDECByI5KjMwCjlQJwIG",
                behaviorModules: ["SpatialSoundPlayer", "AudioMenu"],
                layers: ["pointer"],
                dataLocation: "./assets/SVG/8thNote.svg",
                modelType: "svg",
                color: 0xee2222,
                // loop: true,
            }
        },
    ];
}
