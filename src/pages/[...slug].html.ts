import type { APIRoute, GetStaticPaths } from 'astro';
import home from '../html/home.html?raw';
import studio from '../html/studio.html?raw';
import systems from '../html/systems.html?raw';
import brand from '../html/brand.html?raw';
import progetto from '../html/progetto.html?raw';
import contact from '../html/contact.html?raw';
import privacy from '../html/privacy.html?raw';
import work from '../html/work.html?raw';
import lg from '../html/lg.html?raw';

const pages: Record<string, string> = {
  index: home,
  studio,
  systems,
  brand,
  work,
  'work/project': progetto,
  contact,
  privacy,
  lg,
};

export const getStaticPaths: GetStaticPaths = () =>
  Object.keys(pages).map((slug) => ({ params: { slug } }));

export const GET: APIRoute = ({ params }) =>
  new Response(pages[params.slug as string], {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
