
export interface status_effects {
    name: string
    id: string
    effect: string
}

export interface InitiativeLine {
    id: string
    name: string
    init: number
    init_mod: number
    cmark : boolean
    line_order: number
    npc: boolean
    status_effects: status_effects[]
}

export interface SpellLine {
    id: string
    name: string
    effect: string
    duration_num: number
    duration_type: number
    user_ids: string[]
}

export interface SessionData {
    ondeck: number
    sort: boolean
    initiative: InitiativeLine[] | InitiativeLine
    room: string
}

export interface TargetData {
    id:string
    name:string
    status_effects:status_effects[]
}