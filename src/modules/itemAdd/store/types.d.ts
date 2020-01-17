export interface IDeal {
  id: string
  endsAt: string
  startsAt: string
  newPrice: string
  oldPrice: string
  title: string
  description: string
  link: string
  distributor: string
  score: number
  user: string
  image?: Blob | Uint8Array | ArrayBuffer | string
  timestamp: string
}

export interface IDealStore {
  deals: IDeal[]
  deal: IDeal | null
  comments: IComment[]
}

export interface IComment {
  id: string
  dealId: string
  userId: string
  content: string
  timestamp: string
  userName: string
}
