import DOMPurify from 'dompurify';

export const ExtractMentionID = (text: string) => {
    return text.match(/[^(]+(?=\))/g)
}

export const ParseMention = (text: string | undefined) => {
    if (text == undefined) {
        return '';
    }

    const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;
    const hashtagRegex = /#\[([^\]]+)\]\(([^)]+)\)/g;

    const segments: (JSX.Element | string)[] = [];
    let lastIndex = 0;

    const processMatch = (match :string, display:string, id:string, link: { index: number, href: string }) => {
        segments.push(text.slice(lastIndex, link.index));
        lastIndex = link.index + match.length;

        segments.push(
            <a key={id} href={link.href}>
                {display}
            </a>
        )
    }

    console.log(segments);
    

    text.replace(mentionRegex, (match, display, id, offset) => {
        processMatch(match, `@${display}`, id, { index: offset, href: `/main/profile/${id}` })
        return match
    })

    text.replace(hashtagRegex, (match, display, id, offset) => {
        processMatch(match, `#${display}`, id, { index: offset, href: `/main/hashtag/${id}` })
        return match
    })

    segments.push(text.slice(lastIndex))
    return segments
}

export function DisplayTextFromHTML(text: string | undefined){
    if (text == undefined){
        return ''
    }
    return DOMPurify.sanitize(text)
}