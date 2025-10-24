export class Notification {
    constructor(
        public titre: string,
        public message: string,
        public photoSender:string,
        public date: Date,
    ) {}
}