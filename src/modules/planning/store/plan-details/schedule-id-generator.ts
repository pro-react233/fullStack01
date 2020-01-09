let scheduleIdCounter = 1;

const PREFIX = "tmpscheduleid-";

export function nextScheduleId(): string {
    scheduleIdCounter++;
    return `${PREFIX}${scheduleIdCounter}`;
}

export function isTemporaryScheduleId(id: string): boolean {
    return id && id.indexOf(PREFIX) === 0;
}
