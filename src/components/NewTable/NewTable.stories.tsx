import React from "react";
import { NewTable } from "./NewTable";


export default {
  title: "components/NewTable",
  component: NewTable,
  argTypes: {
    onPress: { action: "pressed" },
  },
};

export const Basic = (args) => <NewTable {...args} />;

Basic.args = {
  text: "Hello World",
  color: "purple",
};
