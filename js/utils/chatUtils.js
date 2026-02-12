export const sortChats = (chats) => {
    chats = chats.sort((chatA, chatB) => {
        const lastA = chatA.messages?.at(-1)?.time;
        const lastB = chatB.messages?.at(-1)?.time;

        const timeA = lastA ? Date.parse(lastA) : 0;
        const timeB = lastB ? Date.parse(lastB) : 0;

        return timeB - timeA;
    });

    return chats;
}