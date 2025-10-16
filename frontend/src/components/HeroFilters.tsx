import type {
  AutocompleteChangeReason,
  AutocompleteRenderInputParams,
  AutocompleteRenderGetTagProps,
} from "@mui/material/Autocomplete";
import {
  Autocomplete,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import type { SyntheticEvent } from "react";

interface HeroFiltersProps {
  positions: readonly string[];
  selectedPositions: string[];
  onPositionsChange: (positions: string[]) => void;
  language: string;
  onLanguageChange: (language: string) => void;
  heroCount: number;
}

const LANGUAGE_OPTIONS = [
  { label: "English", value: "english" },
  { label: "Japanese (beta)", value: "japanese" },
];

export function HeroFilters({
  positions,
  selectedPositions,
  onPositionsChange,
  language,
  onLanguageChange,
  heroCount,
}: HeroFiltersProps) {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        alignItems="flex-start"
      >
        <Stack spacing={1} flex={1}>
          <Typography variant="subtitle2" color="text.secondary">
            ポジションフィルター
          </Typography>
          <Autocomplete
            multiple
            value={selectedPositions}
            onChange={(
              _event: SyntheticEvent,
              value: string[],
              _reason: AutocompleteChangeReason
            ) => onPositionsChange(value)}
            options={positions as string[]}
            renderTags={(
              value: string[],
              getTagProps: AutocompleteRenderGetTagProps
            ) =>
              value.map((option: string, index: number) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  color="primary"
                />
              ))
            }
            renderInput={(params: AutocompleteRenderInputParams) => (
              <TextField
                {...params}
                label="ポジション"
                placeholder="選択したいポジション"
              />
            )}
            sx={{ minWidth: 240 }}
          />
        </Stack>
        <Stack spacing={1} width={{ xs: "100%", md: 220 }}>
          <Typography variant="subtitle2" color="text.secondary">
            表示言語
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="language-select-label">Language</InputLabel>
            <Select
              labelId="language-select-label"
              label="Language"
              value={language}
              onChange={(event: SelectChangeEvent<string>) =>
                onLanguageChange(event.target.value)
              }
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="caption" color="text.secondary">
            表示対象ヒーロー: {heroCount} 体
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}
