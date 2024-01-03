export default async function decorate(block) {
  const elements = block.querySelectorAll(':scope > div');
  elements.forEach((element) => {
    const contents = element.querySelectorAll(':scope > div');
    // const content = contents[0];
    const classes = contents[1];
    element.classList.add(...classes.innerText.toLowerCase().split(' '), 'bento-item');
    classes.remove();
  });
}
