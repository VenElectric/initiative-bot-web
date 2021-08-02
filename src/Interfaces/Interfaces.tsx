
export interface status_effects {
    name: string
    id: string
    color: string
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
    color: string
}

export interface SpellLine {
    id: string
    name: string
    effect: string
    duration_num: number
    duration_type: number
    color: string
}

export interface SessionData {
    ondeck: number
    sort: boolean
    initiative: InitiativeLine[] | InitiativeLine
    room: string
}