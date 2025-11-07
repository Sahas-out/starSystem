import { PlanetState , PlanetShape} from "../models/planet.js";
export const planetsMetaData = [
  {
    shape : PlanetShape.regularSolid1,
    size: 10,
    color: [1.0, 0.2, 0.2],   // red tint
    speed: 0.25,
    state: PlanetState.idle
  },
  {
    shape : PlanetShape.cube,
    size: 18,
    color: [0.2, 0.8, 1.0],   // cyan
    speed: 0.18,
    state: PlanetState.idle
  },
  {
    shape : PlanetShape.regularSolid2,
    size: 26,
    color: [0.8, 0.6, 0.1],   // yellow-orange
    speed: 0.12,
    state: PlanetState.idle
  },
  {
    shape : PlanetShape.sphere,
    size: 34,
    color: [0.6, 0.2, 0.9],   // violet
    speed: 0.1,
    state: PlanetState.idle
  },
  {
    shape : PlanetShape.regularSolid1,
    size: 42,
    color: [0.1, 0.9, 0.3],   // green
    speed: 0.07,
    state: PlanetState.invisible
  },
  {
    shape : PlanetShape.regularSolid2,
    size: 50,
    color: [0.9, 0.3, 0.6],   // pink
    speed: 0.05,
    state: PlanetState.invisible
  }
];

