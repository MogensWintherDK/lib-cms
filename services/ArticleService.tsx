import { collection, getDocs, doc, getDoc, query, where, limit } from 'firebase/firestore';
import { CMSFirestore } from './FirebaseService';
import { CMSContent } from '../utils/CMSContent';
import { ICMSMetadata } from '../types/CMSMetadata';
import { parseCMSMetadata } from '../utils/CMSMetadata';

export interface CMSArticlePathInterface {
    params: {},
}

export interface CMSArticlePathsInterface {
    paths: CMSArticlePathInterface[],
}

export interface CMSHeaderSectionInterface {
    id?: string,
    value: string,
}

export interface CMSTextSectionInterface {
    id?: string,
    value: string,
}

export interface CMSCallToActionSectionInterface {
    id?: string,
    class: string
    header: string,
    text?: string,
    link_text: string,
    link_href: string,
}

export interface CMSStatementSectionInterface {
    id?: string,
    class?: string
    header: string,
    text?: string,
    footer?: string,
}

export interface CMSButtonSectionInterface {
    id?: string,
    link_text: string,
    link_href: string,
}

export interface CMSArticleInterface {
    id: string;
    name: string;
    name_sub?: string;
    tags?: string[];
    teaser: string;
    type: string;
    path: string;
    content?: any;
    page_image_url: string;
    status: string;
    metadata?: ICMSMetadata;
    created_on?: Date;
    updated_on?: Date;
}

export interface CMSArticlesInterface {
    articles: CMSArticleInterface[];
}

export const getCMSArticlePaths = async (type: string = 'article', published: boolean = true): Promise<CMSArticlePathsInterface> => {

    const q = query(
        collection(CMSFirestore, 'articles'),
        where('type', '==', type),
        where('published', '==', published),
    );
    const snapshot = await getDocs(q);
    const items = await Promise.all(
        snapshot.docs.map(async (doc) => {
            const data: CMSArticlePathInterface = {
                params: {
                    id: doc.id,
                    slug: doc.data()['slug'].split('/').pop(),
                }
            };
            return data;

        })
    );
    return { paths: items };
};

export const getCMSArticles = async (articleType = 'article'): Promise<CMSArticlesInterface> => {
    const q = query(
        collection(CMSFirestore, 'articles'),
        where('type', '==', articleType),
        where('published', '==', true),
    );
    const snapshot = await getDocs(q);
    const items = await Promise.all(
        snapshot.docs.map(async (doc) => {
            const { created_on, updated_on, page_image, content, metadata, ...dataWithoutContent } = doc.data();
            const formattedData: CMSArticleInterface = {
                id: doc.id,
                name: dataWithoutContent.name || '',
                teaser: dataWithoutContent.teaser || '',
                type: dataWithoutContent.type || '',
                path: dataWithoutContent.path || '',
                page_image_url: dataWithoutContent.page_image_url || '',
                status: dataWithoutContent.status || '',
                created_on: created_on ? created_on.toDate().toISOString() : new Date().toISOString(),
                updated_on: updated_on ? updated_on.toDate().toISOString() : new Date().toISOString(),
            };
            return formattedData;
        })
    );

    return { articles: items };
};

export const getCMSArticle = async (id: string): Promise<CMSArticleInterface | null> => {
    try {
        const snapshot = await getDoc(doc(CMSFirestore, 'articles', id));
        if (snapshot.exists()) {
            const { page_image, link, content, article_group, metadata, ...data } = snapshot.data();
            const formattedData = {
                ...data,
                content: await CMSContent(content),
                metadata: parseCMSMetadata(metadata),
                created_on: (data.created_on ? data.created_on.toDate().toISOString() : new Date().toISOString()), // Convert Firestore Timestamp to JavaScript Date
                updated_on: (data.updated_on ? data.updated_on.toDate().toISOString() : new Date().toISOString()), // Convert Firestore Timestamp to JavaScript Date
            };
            return formattedData as CMSArticleInterface;
        }
    } catch (e) { }
    return null;
};

export const getCMSArticleBySlug = async (slug: string, path: string = ''): Promise<CMSArticleInterface | null> => {
    try {
        const fullSlug = (path != '' ? '/' + path + '/' : '') + slug;
        const q = query(
            collection(CMSFirestore, 'articles'),
            where('slug', '==', fullSlug),
            where('published', '==', true),
            limit(1)
        );

        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            const { page_image, link, content, article_group, metadata, ...data } = doc.data();
            const formattedData = {
                ...data,
                content: await CMSContent(content),
                metadata: parseCMSMetadata(metadata),
                created_on: (data.created_on ? data.created_on.toDate().toISOString() : new Date().toISOString()), // Convert Firestore Timestamp to JavaScript Date
                updated_on: (data.updated_on ? data.updated_on.toDate().toISOString() : new Date().toISOString()), // Convert Firestore Timestamp to JavaScript Date
            };
            return formattedData as CMSArticleInterface;
        }
    } catch (e) { }
    return null;
};

export const getCMSArticleByType = async (articleType: string): Promise<CMSArticleInterface> => {
    const q = query(
        collection(CMSFirestore, 'articles'),
        where('type', '==', articleType),
        where('published', '==', true),
        limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
        const { page_image, link, content, article_group, metadata, ...data } = snapshot.docs[0].data();
        const formattedData = {
            ...data,
            content: await CMSContent(content),
            metadata: parseCMSMetadata(metadata),
            created_on: (data.created_on ? data.created_on.toDate().toISOString() : new Date().toISOString()), // Convert Firestore Timestamp to JavaScript Date
            updated_on: (data.updated_on ? data.updated_on.toDate().toISOString() : new Date().toISOString()), // Convert Firestore Timestamp to JavaScript Date
        };
        return formattedData as CMSArticleInterface;
    }
    return {} as CMSArticleInterface;
};