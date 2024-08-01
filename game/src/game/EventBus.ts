import { Events } from 'phaser';

// Used to emit events between React components and Phaser scenes
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Events.EventEmitter
export const EventBus = new Events.EventEmitter();

export enum GameEvents {
    COMP_STORED = "composition-stored",
    HAS_COMPOSITION = "has-composition",
    COMPS_LOADED = "compositions-restored",
    COMP_CHANGED = "composition-changed",
    COMP_STATE = "composition-state"
}