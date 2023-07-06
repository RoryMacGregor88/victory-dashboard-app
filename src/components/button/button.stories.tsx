import { Button } from './button.component';

const Index = {
  title: 'Button',
  component: Button,
};

export default Index;

export const Text = () => (
  <>
    <Button variant='text'>Primary</Button>
    <Button variant='text' color='secondary'>
      Secondary
    </Button>
    <Button variant='text' disabled>
      Disabled
    </Button>
    <Button variant='text' href='#text-buttons' color='primary'>
      Link
    </Button>
  </>
);

export const Contained = () => (
  <>
    <Button variant='contained' color='primary'>
      Primary
    </Button>
    <Button variant='contained' color='secondary'>
      Secondary
    </Button>
    <Button variant='contained' disabled>
      Disabled
    </Button>
    <Button variant='contained' href='#text-buttons' color='primary'>
      Link
    </Button>
  </>
);

export const Outlined = () => (
  <>
    <Button variant='outlined' color='primary'>
      Primary
    </Button>
    <Button variant='outlined' color='secondary'>
      Secondary
    </Button>
    <Button variant='outlined' disabled>
      Disabled
    </Button>
    <Button variant='outlined' href='#text-buttons' color='primary'>
      Link
    </Button>
  </>
);

export const Sizes = () => (
  <>
    <div>
      <Button size='small'>Small</Button>
      <Button size='medium'>Medium</Button>
      <Button size='large'>Large</Button>
    </div>
    <div>
      <Button variant='text' size='small'>
        Small
      </Button>
      <Button variant='text' size='medium'>
        Medium
      </Button>
      <Button variant='text' size='large'>
        Large
      </Button>
    </div>
    <div>
      <Button variant='outlined' size='small'>
        Small
      </Button>
      <Button variant='outlined' size='medium'>
        Medium
      </Button>
      <Button variant='outlined' size='large'>
        Large
      </Button>
    </div>
  </>
);

export const Playground = (args) => <Button {...args} />;
Playground.args = {
  children: 'Create your own',
  disabled: false,
  variant: 'contained',
  color: 'primary',
  size: 'medium',
};
Playground.argTypes = {
  variant: {
    control: {
      type: 'inline-radio',
      options: ['contained', 'text', 'outlined'],
    },
  },
  color: {
    control: {
      type: 'inline-radio',
      options: ['primary', 'secondary', 'default', 'inherit'],
    },
  },
  size: {
    control: { type: 'inline-radio', options: ['small', 'medium', 'large'] },
  },
};
