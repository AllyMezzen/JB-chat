import MarkdownIt from "markdown-it";
import highlightJs from "highlight.js";
import Markdown from "@jetbrains/ring-ui-built/components/markdown/markdown";

interface MarkdownItemProps {
    text: string
}

export const MarkdownItem = ({
    text,
}: MarkdownItemProps) => {
    const markdownIt = new MarkdownIt('commonmark', {
        html: false,
        highlight(str, lang) {
            if (lang && highlightJs.getLanguage(lang)) {
                return highlightJs.highlight(str, {
                    language: lang
                }).value;
            }
            return '';
        }
    }).enable('table');
    return <Markdown>
        <div className='markdown-content' dangerouslySetInnerHTML={{
            __html: markdownIt.render(text)
        }} />
    </Markdown>;
}