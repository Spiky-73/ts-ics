import { QUOTE, SEMICOLON, SEPARATOR } from "@/constants";

import { splitOptions } from "./options";
import type { Line } from "@/types";

type GetLineProps<TKey extends string> = {
  property: TKey;
  line: Line;
};

export const separateValue = (line: string) => {
  let isInsideQuotes = false;
  let splitIndex: number | undefined;

  for (let i = 0; i < line.length; i += 1) {
    if (splitIndex !== undefined) break;
    if (line.charAt(i) === QUOTE) {
      isInsideQuotes = !isInsideQuotes;
    }
    if (line.charAt(i) === SEPARATOR && !isInsideQuotes) {
      splitIndex = i;
    }
  }

  if (splitIndex === undefined) throw Error(`Line not valid: ${line}`);

  const property = line.substring(0, splitIndex);
  const value = line.substring(splitIndex + 1);

  return { property, value };
};

export const getLine = <TKey extends string>(
  line: string
): GetLineProps<TKey> => {
  const { property, value } = separateValue(line);

  if (property.includes(SEMICOLON)) {
    const [splittedProperty, ...optionStrings] = property.split(SEMICOLON);

    const options = splitOptions(optionStrings);

    return {
      property: splittedProperty as TKey,
      line: { options, value },
    };
  }

  return { property: property as TKey, line: { value } };
};
