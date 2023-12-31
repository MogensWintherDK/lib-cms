import React from 'react';
import { useRouter } from 'next/router';
import { LNXImage } from '../../lib-lnx/components';
import { CMSArticleInterface } from '../services/ArticleService';

export function CMSTeaserList({ children }: { children: any }): React.JSX.Element {
    return <ul>{children}</ul>
}

export function CMSTeaserTextItem({ id, header, markdown, path }: { id: string, header: string, markdown?: string, path: string }): React.JSX.Element {
    const router = useRouter();
    const clickHandler = (event: React.MouseEvent<HTMLLIElement>, path: string) => {
        event.preventDefault();
        router.push(path);
    };

    return (
        <li key={id} className='TeaserArticle Slim mt-8 p-0 cursor-pointer' onClick={(e: React.MouseEvent<HTMLLIElement>) => clickHandler(e, path)}>
            <div className='flex bg-white rounded'>
                <div className='p-4 w-full flex flex-col flex-1 overflow-hidden'>
                    <div className='w-full text-xxl md:text-2xl font-bold'>{header}</div>
                    <div className="mt-4">{markdown}</div>
                    <div className='justify-end content-end ml-auto'>

                        <a href={path}>
                            <button className=' mt-2 btn'>Læs mere</button>
                        </a>
                    </div>
                </div >
            </div >
        </li>
    );
}

export function CMSTeaserArticleItem({ article }: { article: CMSArticleInterface }): React.JSX.Element {
    const router = useRouter();
    const clickHandler = (event: React.MouseEvent<HTMLLIElement>, path: string) => {
        event.preventDefault();
        router.push(path);
    };

    return (
        <li key={article.id} className='TeaserArticle Slim mt-8 p-0 cursor-pointer' onClick={(e: React.MouseEvent<HTMLLIElement>) => clickHandler(e, article.path)}>
            <div className='flex bg-white rounded'>
                <LNXImage
                    className='hidden sm:flex self-start'
                    src={article.page_image_url}
                    alt={article.name}
                    width='384'
                    height='0'
                />
                <div className='sm:ml-8 p-4 w-full flex flex-col flex-1 overflow-hidden'>
                    <div className='w-full text-xxl font-bold'>{article.name}</div>
                    <div className='mt-1 line-clamp-4 whitespace-pre-line'>{article.teaser}</div>
                    <div className='hidden lg:block ml-auto mt-auto justify-end content-end'>
                        <a href={article.path}>
                            <button className=' mt-2 btn'>Læs mere</button>
                        </a>
                    </div >
                </div >
            </div >
        </li>
    );
}
