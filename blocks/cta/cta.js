export default async function decorate(block) {
  const content = block.querySelector(':scope div > div');
  content.classList.add('cta-content');
}
