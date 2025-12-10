export class TimeRange {
  constructor(public readonly start: Date, public readonly end: Date) {
    if (start >= end) {
      throw new Error('Data inicial deve ser menor que data final');
    }
  }
}

