import type {
  AutocompleteChangeReason,
  AutocompleteRenderInputParams,
  AutocompleteRenderGetTagProps,
} from "@mui/material/Autocomplete";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { SyntheticEvent } from "react";

interface HeroPositionsEditorProps {
  positions: string[];
  defaultPositions: string[];
  availablePositions: readonly string[];
  onChange: (positions: string[]) => void;
}

export function HeroPositionsEditor({
  positions,
  defaultPositions,
  availablePositions,
  onChange,
}: HeroPositionsEditorProps) {
  const isModified =
    JSON.stringify([...positions].sort()) !==
    JSON.stringify([...defaultPositions].sort());

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2" color="text.secondary">
        ポジションのカスタマイズ
      </Typography>
      <Autocomplete
        multiple
        options={availablePositions as string[]}
        value={positions}
        onChange={(
          _event: SyntheticEvent,
          value: string[],
          _reason: AutocompleteChangeReason
        ) => onChange(value)}
        renderInput={(params: AutocompleteRenderInputParams) => (
          <TextField {...params} placeholder="ポジションを追加" size="small" />
        )}
        renderTags={(
          value: string[],
          getTagProps: AutocompleteRenderGetTagProps
        ) =>
          value.map((option: string, index: number) => (
            <Chip
              label={option}
              {...getTagProps({ index })}
              key={option}
              size="small"
            />
          ))
        }
      />
      {isModified ? (
        <Box textAlign="right">
          <Button size="small" onClick={() => onChange(defaultPositions)}>
            デフォルトに戻す
          </Button>
        </Box>
      ) : null}
    </Stack>
  );
}
