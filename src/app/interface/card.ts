export interface Card {
    taskName:string,
    selectedUsers:string[],
    selectedBadges:[{badgeName:string, badgeColor:string, badgeId:string}],
    id:string,
    loggedUserId:string,
    projectId:string,
    boardId:string,
    cardIndex:number
}
