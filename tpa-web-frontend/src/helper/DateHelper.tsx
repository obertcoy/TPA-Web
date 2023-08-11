export function timeSinceShort(date: Date) {
    const now = new Date();
    const secondsPast = (now.getTime() - date.getTime()) / 1000;

    if (secondsPast < 60) {
        return secondsPast.toFixed(0) + 's';
    }
    if (secondsPast < 3600) {
        return (secondsPast / 60).toFixed(0) + 'm';
    }
    if (secondsPast <= 86400) {
        return (secondsPast / 3600).toFixed(0) + 'h';
    }
    if (secondsPast <= 604800) {
        return (secondsPast / 86400).toFixed(0) + 'd';
    }
    if (secondsPast > 604800) {
        return (secondsPast / 604800).toFixed(0) + 'w';
    }
}

export function timeSinceLong(date: Date) {
    const now = new Date();
    const secondsPast = (now.getTime() - date.getTime()) / 1000;

    if (secondsPast < 60) {
        return secondsPast.toFixed(0) + ' seconds ago';
    }
    if (secondsPast < 3600) {
        return (secondsPast / 60).toFixed(0) + ' minutes ago';
    }
    if (secondsPast <= 86400) {
        return (secondsPast / 3600).toFixed(0) + ' hours ago';
    }
    if (secondsPast <= 604800) {
        return (secondsPast / 86400).toFixed(0) + ' days ago';
    }
    if (secondsPast > 604800) {
        return (secondsPast / 604800).toFixed(0) + ' weeks ago';
    }
}